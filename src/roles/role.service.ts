import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesEnum } from './roles.enum';

@Injectable()
export class RoleService {
  async validateRole(roleKey: string): Promise<boolean> {
    const role = RolesEnum[roleKey];
    if (!role) {
      throw new NotFoundException('Invalid role key: ' + role);
    }

    return true;
  }

  async validateRoles(keys: string[]): Promise<boolean> {
    keys.forEach((key) => {
      if (!this.validateRole(key)) {
        return false;
      }
    });

    return true;
  }

  getAll() {
    const keys = Object.keys(RolesEnum);
    const data = [];

    keys.forEach((key) => {
      data.push({ key: key, value: RolesEnum[key] });
    });

    return data;
  }
}
