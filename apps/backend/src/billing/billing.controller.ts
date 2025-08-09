import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { PlanOutput, CheckoutOutput, BillingStatusOutput } from './dto/outputs';
import { CheckoutDto } from './dto/checkout.dto';
import { ProtectedRoute } from '../auth/protected-route.decorator';
import { PublicRoute } from '../auth/public-route.decorator';
import { AuthRequest } from '../auth/interfaces/request.interface';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(
    @Inject(BillingService)
    private readonly billingService: BillingService,
  ) {}

  @Get('plans')
  @PublicRoute()
  @ApiOperation({ summary: 'List active plans' })
  @ApiOkResponse({ type: [PlanOutput] })
  async getPlans(): Promise<PlanOutput[]> {
    const plans = await this.billingService.listActivePlans();
    return plans.map((p) => ({
      code: p.code as any,
      name: p.name,
      priceCents: p.priceCents,
      currency: p.currency,
      interval: p.interval as any,
    }));
  }

  @Post('checkout')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Create checkout session' })
  @ApiBody({ type: CheckoutDto })
  @ApiOkResponse({ type: CheckoutOutput })
  async checkout(
    @Body() dto: CheckoutDto,
    @Req() req: AuthRequest,
  ): Promise<CheckoutOutput> {
    return this.billingService.createCheckoutSession({
      userId: req.user.sub,
      planCode: dto.planCode,
    });
  }

  @Post('webhook')
  @PublicRoute()
  @HttpCode(200)
  @ApiOperation({ summary: 'Mollie webhook endpoint' })
  async webhook(@Body() body: any, @Query('secret') secret?: string) {
    if (
      process.env.MOLLIE_WEBHOOK_SECRET &&
      secret !== process.env.MOLLIE_WEBHOOK_SECRET
    ) {
      // Silently accept to avoid probing
      return { ok: true };
    }
    const paymentId = body?.id || body?.paymentId || body?.resource?.id;
    console.log('paymentId', paymentId);
    if (!paymentId) {
      return { ok: true };
    }
    await this.billingService.handleWebhook(paymentId);
    return { ok: true };
  }

  @Get('status')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Get current billing status' })
  @ApiOkResponse({ type: BillingStatusOutput })
  async status(@Req() req: AuthRequest): Promise<BillingStatusOutput> {
    const res = await this.billingService.getStatus(req.user.sub);
    return {
      ...res,
      currentPeriodEnd: res.currentPeriodEnd
        ? new Date(res.currentPeriodEnd).toISOString()
        : null,
    } as BillingStatusOutput;
  }

  @Post('cancel')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Cancel auto-renew at period end (recurring only)' })
  async cancel(@Req() req: AuthRequest) {
    return this.billingService.cancel(req.user.sub);
  }
}
