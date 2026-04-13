import type { User, UserDTO } from "./user.types";

export function mapToUser(userDto: UserDTO): User {
  return {
    email: userDto.email,
    firstName: userDto.first_name,
    lastName: userDto.last_name,
  };
}
