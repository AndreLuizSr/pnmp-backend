import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesModel } from './dto/role.dto';
import { Roles } from './role.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Roles.name) private readonly rolesModel: Model<Roles>,
  ) {}

  async findByIds(ids: string[]): Promise<Roles[]> {
    return this.rolesModel.find({ _id: { $in: ids } }).exec();
  }

  async findAll(): Promise<Roles[]> {
    return this.rolesModel.find().exec();
  }

  async findOneId(_id: string): Promise<Roles> {
    const role = await this.rolesModel.findOne({ _id }).exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async create(createRoleDto: RolesModel): Promise<Roles> {
    const createdRole = new this.rolesModel(createRoleDto);
    return createdRole.save();
  }

  async update(_id: string, updateRoleDto: RolesModel): Promise<Roles> {
    const existingRole = await this.rolesModel
      .findOneAndUpdate({ _id }, updateRoleDto, { new: true })
      .exec();
    if (!existingRole) {
      throw new NotFoundException('Role not found');
    }
    return existingRole;
  }

  async remove(_id: string): Promise<void> {
    const result = await this.rolesModel.deleteOne({ _id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Role not found');
    }
  }
}
