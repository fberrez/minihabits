import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CompleteSubscriptionDto } from './dto/complete-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('billing')
@Controller('billing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  async getPlans() {
    return this.billingService.getPlans();
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Get user subscription information' })
  @ApiResponse({ status: 200, description: 'Subscription info retrieved successfully' })
  async getSubscriptionInfo(@Request() req) {
    return this.billingService.getUserSubscriptionInfo(req.user.sub);
  }

  @Post('subscription')
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription creation initiated' })
  @ApiResponse({ status: 400, description: 'Invalid plan or user data' })
  async createSubscription(
    @Request() req,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.billingService.createSubscription(
      req.user.sub,
      createSubscriptionDto.planId,
      createSubscriptionDto.successRedirectUrl,
    );
  }

  @Post('subscription/complete')
  @ApiOperation({ summary: 'Complete subscription after payment confirmation' })
  @ApiResponse({ status: 200, description: 'Subscription completed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid flow data' })
  @HttpCode(HttpStatus.OK)
  async completeSubscription(
    @Request() req,
    @Body() completeSubscriptionDto: CompleteSubscriptionDto,
  ) {
    return this.billingService.completeSubscription(
      req.user.sub,
      completeSubscriptionDto.flowId,
      completeSubscriptionDto.sessionToken,
      completeSubscriptionDto.planId,
    );
  }

  @Delete('subscription')
  @ApiOperation({ summary: 'Cancel current subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled successfully' })
  @ApiResponse({ status: 400, description: 'No active subscription found' })
  async cancelSubscription(@Request() req) {
    return this.billingService.cancelSubscription(req.user.sub);
  }
}