db = db.getSiblingDB(process.env.MONGO_TARGET_DB || 'geoscout_db');

if (db.getCollection('users').countDocuments() === 0) {
    db.createCollection('users');
    db.users.insertOne({
        'email': 'admin@geoscout.org',
        'password': '',
        'role': 2,
        'isWhitelisted': true
    });
    print('SUCCESS: Initial admin user created.');
} else {
    print('INFO: Users collection already exists.');
}
