#!/usr/bin/env node
import { getArgs } from "./helpers/args.js";
import { getWeather, getIcon } from "./services/api.service.js";
import { printHelp, printError, printSuccess, printWeather } from "./services/log.service.js";
import { getKeyValue, saveKeyValue, TOKEN_DICTIONARY } from "./services/storage.service.js";

const saveCity = async (city) => {
  if (!city.length) {
    printError('City not passed!');
    return undefined;
  }

  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, city);
    printSuccess('City saved'); 
  } catch (e) {
    printError(e.message);
  }
}

const saveToken = async (token) => {
  if (!token.length) {
    printError('Token not passed!');
    return undefined;
  }

  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);
    printSuccess('Token saved'); 
  } catch (e) {
    printError(e.message);
  }
}

const getForecast = async () => {
  try {
    const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city);
    const weather = await getWeather(city);
    printWeather(weather, getIcon(weather.weather[0].icon))
  } catch (err) {
    if (err?.response?.status === 404) {
      printError('Wrong city was set');
    } else if (err?.response?.status === 401) {
      printError('Wrong token was set');
    } else {
      printError(err);
    }
  }
}

const initCLI = () => {
  const args = getArgs(process.argv);
  if (args.h) {
    printHelp();
  }
  if (args.s) {
    return saveCity(args.s) // save city
  }
  if (args.t) {
    return saveToken(args.t);
  }
  return getForecast();
}

initCLI()
