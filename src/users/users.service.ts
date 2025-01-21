import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
import { HabitsService } from 'src/habits/habits.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private habitsService: HabitsService,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const user = await newUser.save();
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }

  async findOne(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    return user as User;
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').lean().exec();
  }

  async updateEmail(userId: string, newEmail: string, password: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const oldEmail = user.email;
    user.email = newEmail;
    await user.save();

    await this.emailService.sendEmailChangeConfirmation(oldEmail, newEmail);
    return this.findById(userId);
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return user.save();
  }

  async deleteAccount(userId: string, password: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    await this.emailService.sendAccountDeletionConfirmation(user.email);
    await this.userModel.findByIdAndDelete(userId);
    await this.habitsService.deleteAllHabits(userId);
    return { message: 'Account deleted successfully' };
  }

  async createPasswordResetToken(email: string) {
    const user = await this.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await this.userModel.findByIdAndUpdate(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    });

    await this.emailService.sendPasswordReset(email, resetToken);
    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }
}
