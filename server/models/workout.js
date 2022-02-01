'use strict';
const {
  Model, INET
} = require('sequelize');

const { Sequelize } = require('.');
const { DATE } = require('sequelize');
const { INTEGER } = require('sequelize');
const { BIGINT } = require('sequelize');
const { JSONB } = require('sequelize');
//const db = require('./index.js');

module.exports = (sequelize, DataTypes) => {
  class Workout extends Model {
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
      // //console.log("Sequelize StravaAccount associate(models) ended");
    }
  }
  Workout.init({
    userid_creator: {
      type: INTEGER
    },
    userid_currentowner: {
      type: INTEGER
    },
    workout_id: {
      type: BIGINT
    },
    external_account_type: {
      type: DataTypes.TEXT
    },
    external_account_id: {
      type: BIGINT
    },
    status: {
      type: DataTypes.TEXT
    },
    workout_date: {
        type: DATE
    },
    title: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
    },
    strava_details: {
      type: JSONB
    }
    
  }, {
    sequelize,
    modelName: 'Workout',
  });

  //Strip refresh_token from toJSON method so that it doesn't accidentally get sent to client
  Workout.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    //delete values.refresh_token;
    //delete values.password_hash;
    return values;
  }

  
  
  return Workout;
};