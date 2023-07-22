class UserDto {

    constructor(user){
        this.id = user._id,
        this.username = user.username,
        this.email = user.email,
        this.photo = user.photo,
        this.createdAt = user.createdAt,
        this.updatedAt = user.updatedAt
    }
}

module.exports = UserDto;