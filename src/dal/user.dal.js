const userRepository = (db) => {
  // validation not done here in this layer (this is done in service layer)

  // get user by user id
  const getUserById = async (userId) => {
    try {
      return await db.one('select * from users where id = $1', [userId]);
    } catch (error) {
      throw Error(`${userId} does not exist`);
    }
  };

  // save user in db
  const saveUser = async (user) => {
    try {
      const { id } = await db.one(
        'INSERT INTO users(first_name, middle_name, last_name, password, email) VALUES($1, $2, $3, $4, $5) RETURNING id',
        [
          user.first_name,
          user.middle_name,
          user.last_name,
          user.password,
          user.email,
        ]
      );
      return id;
    } catch (error) {
      throw Error('Not Valid User Data');
    }
  };

  return { getUserById, saveUser };
};

module.exports = userRepository;
