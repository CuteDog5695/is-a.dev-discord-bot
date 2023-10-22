require('dotenv').config();
const mongoose = require('mongoose');
const UserOld = require('./models/UserOld'); // Adjust the path to your UserOld model
const UserNew = require('./models/UserNew'); // Adjust the path to your UserNew model

// MongoDB connection URLs
const oldDBUrl = process.env.OLDMONGO_DB;
const newDBUrl = process.env.NEWMONGO_DB;

async function migrateUsers() {
  try {
    await mongoose.connect(oldDBUrl, { useNewUrlParser: true, useUnifiedTopology: true, });
    console.log('Connected to old MongoDB');

    const usersToMigrate = await UserOld.find({}).exec();

    // Transform and insert users into the new schema
    const transformedUsers = usersToMigrate.map((user) => {
      return new UserNew({
        _id: user.userid, // Use the old 'userid' as the new '_id'
        githubUsername: user.githubid,
        email: user.email,
        githubAccessToken: user.gittoken,
      });
    });

    await UserNew.insertMany(transformedUsers);
    console.log(`Migrated ${transformedUsers.length} users.`);

    mongoose.disconnect();
    console.log('Disconnected from old MongoDB');
  } catch (error) {
    console.error('Error migrating users:', error);
  }
}

migrateUsers();
