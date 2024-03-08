import { User } from '../../user/user.entity';

export default class TesteUtil {
  static giveAMeAValidUser(): User {
    const user = new User();
    user.id = '1';
    user.email = 'johndoe@email.com';
    user.name = 'John Doe';
    user.password = '123456';
    return user;
  }
}
