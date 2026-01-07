import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('weather.db');

export const initDB = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );`
            );


            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS SearchHistory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          city_name TEXT NOT NULL,
          search_count INTEGER DEFAULT 1,
          last_searched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES Users(id)
        );`
            );


            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          city_name TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES Users(id)
        );`,
                [],
                () => {
                    console.log("Database initialized successfully");
                    resolve();
                },
                (_, error) => {
                    console.log("Error initializing DB: ", error);
                    reject(error);
                }
            );
        });
    });
};

export const addUser = (username, email, password) => {
    console.log(`[DB] addUser: ${username}, ${email}`);
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
                [username, email, password],
                (_, result) => {
                    console.log('[DB] User added successfully:', result);
                    resolve(result);
                },
                (_, error) => {
                    console.error('[DB] Error adding user:', error);
                    reject(error);
                }
            );
        });
    });
};

export const getUser = (email, password) => {
    console.log(`[DB] getUser: ${email}`);
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Users WHERE email = ? AND password = ?',
                [email, password],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        console.log('[DB] User found:', _array[0].id);
                        resolve(_array[0]);
                    } else {
                        console.log('[DB] User NOT found');
                        resolve(null);
                    }
                },
                (_, error) => {
                    console.error('[DB] ExecuteSql Error in getUser:', error);
                    reject(error);
                }
            );
        }, (tError) => {
            console.error('[DB] Transaction Error in getUser:', tError);
            reject(tError);
        }, () => {
            console.log('[DB] Transaction Success in getUser');
        });
    });
};


export const addSearchHistory = (userId, cityName) => {
    console.log(`[DB] addSearchHistory for User ${userId}, City: ${cityName}`);
    return new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                'SELECT * FROM SearchHistory WHERE user_id = ? AND city_name = ?',
                [userId, cityName],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        console.log(`[DB] City exists in history, updating count...`);

                        tx.executeSql(
                            'UPDATE SearchHistory SET search_count = search_count + 1, last_searched_at = CURRENT_TIMESTAMP WHERE id = ?',
                            [_array[0].id],
                            (_, result) => {
                                console.log('[DB] History count updated');
                                resolve(result);
                            },
                            (_, error) => {
                                console.error('[DB] Error updating history', error);
                                reject(error);
                            }
                        );
                    } else {
                        console.log(`[DB] New city, inserting into history...`);
                        tx.executeSql(
                            'INSERT INTO SearchHistory (user_id, city_name) VALUES (?, ?)',
                            [userId, cityName],
                            (_, result) => {
                                console.log('[DB] History inserted');
                                resolve(result);
                            },
                            (_, error) => {
                                console.error('[DB] Error inserting history', error);
                                reject(error);
                            }
                        );
                    }
                },
                (_, error) => {
                    console.error('[DB] Error checking history', error);
                    reject(error);
                }
            );
        });
    });
};

export const getMostSearchedCity = (userId) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT city_name, search_count FROM SearchHistory WHERE user_id = ? ORDER BY search_count DESC LIMIT 1',
                [userId],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) resolve(_array[0]);
                    else resolve(null);
                },
                (_, error) => reject(error)
            );
        });
    });
};

export const addFavorite = (userId, cityName) => {
    console.log(`[DB] addFavorite for User ${userId}, City: ${cityName}`);
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Favorites (user_id, city_name) VALUES (?, ?)',
                [userId, cityName],
                (_, result) => {
                    console.log('[DB] Favorite added');
                    resolve(result);
                },
                (_, error) => reject(error)
            );
        });
    });
};

export const removeFavorite = (userId, cityName) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM Favorites WHERE user_id = ? AND city_name = ?',
                [userId, cityName],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};

export const getFavorites = (userId) => {
    console.log(`[DB] getFavorites for User ${userId}`);
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Favorites WHERE user_id = ?',
                [userId],
                (_, { rows: { _array } }) => {
                    console.log(`[DB] Favorites for ${userId}:`, _array);
                    resolve(_array);
                },
                (_, error) => reject(error)
            );
        });
    });
};


export const updateUser = (userId, newUsername, newPassword) => {
    console.log(`[DB] updateUser: ${userId}, ${newUsername}`);
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            let query = 'UPDATE Users SET username = ? WHERE id = ?';
            let params = [newUsername, userId];

            if (newPassword && newPassword.length > 0) {
                query = 'UPDATE Users SET username = ?, password = ? WHERE id = ?';
                params = [newUsername, newPassword, userId];
            }

            tx.executeSql(
                query,
                params,
                (_, result) => {
                    console.log('[DB] User updated');
                    resolve(result);
                },
                (_, error) => {
                    console.error('[DB] Error updating user', error);
                    reject(error);
                }
            );
        });
    });
};

export const getDB = () => db;
