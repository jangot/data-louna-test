
interface User {
    username: string;
    password: string;
}

const list: User[] = [];

export const userSerivce = {
    isUserNameExists: async (username: string) => {
        const user = list.find((user) => user.username === username);

        return !!user;
    },
    find: async (user: string) => {

    }
}
