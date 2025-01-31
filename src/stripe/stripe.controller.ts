import {
  Body,
  Controller,
  Post,
  Req,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { AuthRequest } from 'src/auth/interfaces/request.interface';
import { Public } from 'src/auth/auth.decorator';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @ApiBody({
    type: CreateCheckoutSessionDto,
  })
  createCheckoutSession(
    @Req() req: AuthRequest,
    @Body() body: CreateCheckoutSessionDto,
  ) {
    return this.stripeService.createCheckoutSession(
      body.priceId,
      req.user.email,
    );
  }

  @Post('subscription/cancel')
  cancelSubscription(@Req() req: AuthRequest) {
    return this.stripeService.cancelSubscription(req.user.sub);
  }

  @Post('verify-session')
  verifySession(@Req() req: AuthRequest) {
    return this.stripeService.verifySession(req.user.sub, req.body.sessionId);
  }

  @Post('webhook')
  @Public()
  webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<any>,
  ) {
    const payload = req.rawBody;
    return this.stripeService.webhook(payload, signature);
  }
}
