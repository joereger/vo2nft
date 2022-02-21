'use strict';
const {
  Model, INET
} = require('sequelize');

const { DATE } = require('sequelize');
const { INTEGER } = require('sequelize');
const { BIGINT } = require('sequelize');
const { JSONB } = require('sequelize');
//const db = require('./index.js');

module.exports = (sequelize, DataTypes) => {
  class StravaAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //console.log("Sequelize StravaAccount associate(models) started");
      // models.User.hasOne(models.StravaAccount, {
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      //   foreignKey: 'id', 
      //   constraints: false
      // });
      // models.StravaAccount.belongsTo(models.User, {
      //   foreignKey: {
      //       name: 'userId',
      //       allowNull: false
      //     },
      // });
      //console.log("Sequelize StravaAccount associate(models) ended");
    }
  };
  StravaAccount.init({
    username: {
      type: DataTypes.TEXT
    },
    userId: {
      type: INTEGER,
      unique: true
    },
    athlete_id: {
      type: BIGINT
    },
    auth_token: {
      type: DataTypes.TEXT
    },
    auth_token_expires_at: {
        type: DATE
    },
    refresh_token: {
      type: DataTypes.TEXT
    },
    profile_pic: {
      type: DataTypes.TEXT
    },
    bio: {
      type: DataTypes.TEXT
    },
    firstname: {
      type: DataTypes.TEXT
    },
    lastname: {
      type: DataTypes.TEXT
    }, 
    is_syncing: {
      type: DataTypes.BOOLEAN
    },
    webhook_subscription_id: {
      type: DataTypes.TEXT
    },
    strava_details: {
      type: JSONB
    }
  }, {
    sequelize,
    modelName: 'StravaAccount',
  });

  //Strip refresh_token from toJSON method so that it doesn't accidentally get sent to client
  StravaAccount.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    //delete values.refresh_token;
    //delete values.password_hash;
    return values;
  }

  
  
  return StravaAccount;
};