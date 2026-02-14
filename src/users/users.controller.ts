import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersGuard } from './guards/users.guard';
import { SetUsernameDto } from './dto/set-username.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) { };

    @Get()
    findAll() {
        return this.usersService.findAll();
    };

    @Delete()
    deleteAll() {
        return this.usersService.deleteAll();
    };

    @Get("username-available")
    usernameAvailable(
        @Query("u") u: string
    ) {
        return this.usersService.usernameAvailable(u);
    }

    @UseGuards(UsersGuard)
    @Patch("set-username")
    @UseInterceptors(FileInterceptor('avatar'))
    setUsername(
        @Req() req: any,
        @Body() dto: SetUsernameDto,
        @UploadedFile() avatar: Express.Multer.File

    ) {
        return this.usersService.setUsername({ userId: req.user.id, username: dto.username, avatar })
    }
};
