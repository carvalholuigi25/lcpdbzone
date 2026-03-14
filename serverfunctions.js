import axios from 'axios';
import fs from 'fs';
import { create, all } from 'mathjs';
import * as shared from './shared-utils.mjs';

const math = create(all);

const { getWarnTimeExpireCalc, setHouseNumZero, getTimeNow, getDateNow, getTimezone, getDateByTimezone, getTimeByTimezone, getDateTimeByTimezone, generateJoke, generateQuote, getListModels, roundNum, genRandomNumbersSimple, shuffleNums, getCountdownResult, getCountupResult, getDataSizeConversion, getTimeConversion, getTemperatureConversion, getLengthConversion, getWeightConversion, getSpeedConversion, getPressureConversion, getVolumeConversion, getEnergyConversion, getInspiredBy, getMotivation, getColorListHex, getCurrencyConversion, getRadioStationsByCountry, getYoutubeSearch } = shared;

function getHelpCmds() {
  const {cmds} = JSON.parse(fs.readFileSync('./list_help_cmds.json', 'utf-8'));
  return cmds || [];
}

function getCalculatorResult(expression) {
  try {
    // Validate the expression to allow only numbers and basic operators
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      throw new Error("Invalid characters in expression.");
    }

    // Evaluate the expression safely using mathjs
    const result = math.evaluate(expression);
    return `The result of ${expression} is: ${result}`;
  }
  catch (error) {
    return "Error evaluating expression: " + error.message;
  }
}

function getCalcAgeResult(birthYear) {
  try {
    const currentYear = new Date().getFullYear();
    if (isNaN(birthYear) || birthYear < 0 || birthYear > currentYear) {
      throw new Error("Invalid birth year.");
    }
    const age = currentYear - birthYear;
    return `You are approximately ${age} years old.`;
  }
  catch (error) {
    return "Error calculating age: " + error.message;
  }
}

export { getWarnTimeExpireCalc, getTimezone, getTimeNow, getTimeByTimezone, getDateNow, getDateByTimezone, getDateTimeByTimezone, getHelpCmds, generateJoke, generateQuote, getListModels, getCalculatorResult, getCalcAgeResult, getCountdownResult, getCountupResult, getDataSizeConversion, getTemperatureConversion, getTimeConversion, getCurrencyConversion, getLengthConversion, getWeightConversion, getVolumeConversion, getPressureConversion, getSpeedConversion, getEnergyConversion, getInspiredBy, getMotivation, getRadioStationsByCountry, getYoutubeSearch, getColorListHex, shuffleNums, genRandomNumbersSimple as genRandomNumbers };