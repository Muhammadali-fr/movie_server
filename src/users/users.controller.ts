import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersGuard } from './guards/users.guard';
import { SetUsernameDto } from './dto/set-username.dto';

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
    setUsername(
        @Req() req: any,
        @Body() dto: SetUsernameDto
    ) {
        return this.usersService.setUsername(req.user.id, dto.username)
    }
};
