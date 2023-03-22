/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import PeopleUserModel from './people_user.model';
import peopleUsers from './peopleHeb.json';
import { IPeopleUser } from './people_user.interface';

export class users {
    // add users
    // i want to restare the mongo with upsert so it wont users creationg wont need to happen once
    // cause i cant delete line like i always
    static async createUser() {
        const addedPeopleUser: IPeopleUser[] = await Promise.all(
            peopleUsers.map((user) =>
                PeopleUserModel.findOneAndUpdate({ username: user.username }, user, {
                    upsert: true,
                    new: true,
                }).exec()
            )
        );
        return addedPeopleUser;
    }

    // get user by username (t_yarin_h)
    static async getUser(username: string, fields: string[]) {
        const user: IPeopleUser | null = await PeopleUserModel.findOne({ username }).select('-__v -_id').lean().exec();

        if (user === null) {
            throw new Error();
        }

        return user;
    }

    // Note: fields should be type of UserField[] from People-Api package!
    static async getUsers(branch: string, fields: string[]) {
        const branchUsers: IPeopleUser[] = await PeopleUserModel.find({ branch }).exec();
        if (users === null) {
            throw new Error();
        }
        return branchUsers;
    }
}
