import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  RawBody,
  Headers,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { ProtectedRoute } from '../auth/protected-route.decorator';
import { PublicRoute } from '../auth/public-route.decorator';
import { AuthRequest } from '../auth/interfaces/request.interface';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreateSubscriptionResponseDto } from './dto/create-subscription-response.dto';
import { SubscriptionLimitsDto } from './dto/subscription-limits.dto';
import { SubscriptionPlanInfoDto } from './dto/subscription-plan-info.dto';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(private readonly billingService: BillingService) {}

  @ProtectedRoute()
  @Get('plans')
  @ApiOperation({ summary: 'Get all available subscription plans' })
  @ApiOkResponse({
    description: 'List of subscription plans',
    type: [SubscriptionPlanInfoDto],
  })
  async getSubscriptionPlans(): Promise<SubscriptionPlanInfoDto[]> {
    return this.billingService.getSubscriptionPlans();
  }

  @ProtectedRoute()
  @Get('limits')
  @ApiOperation({ summary: 'Get user subscription limits and current usage' })
  @ApiOkResponse({
    description: 'User subscription limits',
    type: SubscriptionLimitsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getSubscriptionLimits(@Request() req: AuthRequest): Promise<SubscriptionLimitsDto> {
    return this.billingService.getSubscriptionLimits(req.user.sub);
  }

  @ProtectedRoute()
  @Post('create-subscription')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new subscription or one-time payment' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully',
    type: CreateSubscriptionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid subscription plan or user already has active subscription',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async createSubscription(
    @Request() req: AuthRequest,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<CreateSubscriptionResponseDto> {
    return this.billingService.createSubscription(req.user.sub, createSubscriptionDto);
  }

  @ProtectedRoute()
  @Delete('cancel-subscription')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel user subscription' })
  @ApiOkResponse({
    description: 'Subscription cancelled successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Subscription cancelled successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No active subscription found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async cancelSubscription(@Request() req: AuthRequest): Promise<{ message: string }> {
    return this.billingService.cancelSubscription(req.user.sub);
  }

  @PublicRoute()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Mollie webhook notifications' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook signature or payload',
  })
  async handleWebhook(
    @RawBody() rawBody: Buffer,
    @Headers('mollie-signature') signature: string,
  ): Promise<{ status: string }> {
    this.logger.debug('Received Mollie webhook');

    try {
      // Parse the raw body to get the payment ID
      const body = rawBody.toString('utf8');
      const webhookData = JSON.parse(body);
      
      if (!webhookData.id) {
        this.logger.warn('No payment ID in webhook payload');
        return { status: 'error' };
      }

      // Process the webhook
      await this.billingService.processWebhook(webhookData.id);
      
      this.logger.log(`Webhook processed successfully for payment: ${webhookData.id}`);
      return { status: 'success' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process webhook: ${errorMessage}`);
      return { status: 'error' };
    }
  }
}