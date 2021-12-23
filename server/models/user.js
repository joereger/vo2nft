'use strict';
const {
  Model
} = require('sequelize');

const passportLocalSequelize = require('passport-local-sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.TEXT
    },
    password_salt: {
      type: DataTypes.TEXT
    },
    activation_key: {
        type: DataTypes.STRING
    },
    reset_password_key: {
        type: DataTypes.STRING
    },
    verified: {
        type: DataTypes.BOOLEAN
    },
    refresh_token: { 
        type: DataTypes.TEXT, 
        get: function() {
            return JSON.parse(this.getDataValue('refresh_token'));
        }, 
        set: function(val) {
            return this.setDataValue('refresh_token', JSON.stringify(val));
        }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  //Strip refresh_token from toJSON method so that it doesn't accidentally get sent to client
  User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    delete values.refresh_token;
    return values;
  }

  passportLocalSequelize.attachToUser(User, {
    usernameField: 'email',
    hashField: 'password_hash',
    saltField: 'password_salt',
    activationKeyField: 'activation_key',
    resetPasswordKeyField: 'reset_password_key',
    activationkeylen:  8,
    resetPasswordkeylen:  8,
    saltlen:  32,
    iterations:  12000,
    keylen:  512,
    digest:  'sha1',
    usernameLowerCase: false,
    activationRequired: false,
    incorrectPasswordError: 'Incorrect password',
    incorrectUsernameError: 'Incorrect username',
    invalidActivationKeyError: 'Invalid activation key',
    invalidResetPasswordKeyError: 'Invalid reset password key',
    missingUsernameError: 'Field %s is not set',
    missingFieldError: 'Field %s is not set',
    missingPasswordError: 'Password argument not set!',
    userExistsError: 'User already exists with %s',
    activationError: 'Email activation required',
    noSaltValueStoredError: 'Authentication not possible. No salt value stored in db.'
  });
  

  return User;
};