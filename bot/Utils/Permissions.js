module.exports = {
	OWNER: 1 << 1,
	SUPERADMIN: 1 << 2,
	ADMIN: 1 << 3,


	check(permission, perm) {
		perm = this[perm];
		if (typeof perm === 'function') {throw new Error('cannot specify a function');}
		return ((permission & perm) === perm);
	},

	checkSome(permission, perms) {
		return perms.some((perm) => this.check(permission, perm));
	}
};