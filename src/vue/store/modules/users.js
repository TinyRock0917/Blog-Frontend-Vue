export const users = {

    namespaced: true,

    state: [],

    actions: {

        async update({state, rootState}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                variables: {apikey},
                query: `
                       query GetAllUsers($apikey: String!) {
                           getAllUsers(apikey: $apikey) {
                               id,
                               username,
                               fullname,
                               permissions,
                               deactivated,
                               email
                           }
                       }
                `
            }).then(({errors, data: {getAllUsers}}) => {

                if (errors && errors.length) {
                    // TODO: Log?
                } else if (Array.isArray(getAllUsers)) {
                    state.splice(0, state.length, ...getAllUsers);
                }

            });
        },

        async setPermission({state, rootState}, {user, type, permission}) {
            const {apikey} = rootState.auth;
            const {id} = user;

            if (type === 'add') {
                user.permissions.push(permission);
            } else if (type === 'remove') {
                const idx = user.permissions.indexOf(permission);
                ~idx && user.permissions.splice(idx, 1);
            } else {
                return Promise.reject();
            }

            const {permissions} = user;
            return this.dispatch('graphql', {
                variables: {apikey, permissions, id},
                query: `
                       query UpdateUser($id: String!, $apikey: String!, $permissions: [String]!) {
                           updateUser(id: $id, apikey: $apikey, permissions: $permissions) {
                               id
                           }
                       }
                `
            }).then(({errors}) => {
                if (errors && errors.length) {
                    // TODO: Log?
                } else {
                    return this.dispatch('users/update');
                }
            });
        },

        async setDeactivated({state, rootState}, {user, deactivated}) {
            const {apikey} = rootState.auth;
            const {id} = user;

            return this.dispatch('graphql', {
                variables: {apikey, deactivated, id},
                query: `
                       query UpdateUser($id: String!, $apikey: String!, $deactivated: Boolean!) {
                           updateUser(id: $id, apikey: $apikey, deactivated: $deactivated) {
                               id
                           }
                       }
                `
            }).then(({errors}) => {

                if (errors && errors.length) {
                    // TODO: Log?
                } else {
                    return this.dispatch('users/update');
                }

            });
        }
    }

};
