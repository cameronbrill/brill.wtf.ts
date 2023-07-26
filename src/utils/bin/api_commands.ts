import {
  getProjects,
  getQuote,
  getReadme,
  getWeather,
  newLink,
  getLink,
} from '../api';

export const projects = async (args: string[]): Promise<string> => {
  const projects = await getProjects();
  return projects
    .map(
      (repo) =>
        `${repo.name} - <a class="text-light-blue dark:text-dark-blue underline" href="${repo.html_url}" target="_blank">${repo.html_url}</a>`,
    )
    .join('\n');
};

export const quote = async (args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};

export const readme = async (args: string[]): Promise<string> => {
  const readme = await getReadme();
  return `Opening GitHub README...\n
  ${readme}`;
};

export const weather = async (args: string[]): Promise<string> => {
  const cmds = [
    ['--city', '-c'],
    ['--here', '-H'],
    ['--help', '-h'],
  ];

  var isValid = false;
  for (const cmd of cmds) {
    if (cmd.indexOf(args[0]) !== -1) {
      isValid = true;
      break;
    }
  }
  if (!isValid) args = ['--help'];

  var city: string | undefined;
  if (args[0] === '--city' || args[0] === '-c') {
    city = args.slice(1).join('+');
    if (!city) args[0] = '--help';
  }

  if (args[0] == '--help' || args[0] == '-h')
    return 'Usage: weather [--city,-c (city...)] [--here, -H] [--help, -h]. Example: weather --city san francisco.';
  const weather = await getWeather(city);
  return weather;
};

export const link = async (args: string[]): Promise<string> => {
  if (args[0] === 'get') {
    const short = args[1];
    if (!short) {
      return 'Usage: link get [short]. Example:\n$ link get video\n$ > https://youtu.be/dQw4w9WgXcQ';
    }

    try {
      const link = await getLink({
        short,
      });
      return `https://brill.wtf/${link?.short} points to: ${link?.original}`;
    } catch (e) {
      if (e.response.status === 404) {
        return `https://brill.wtf/${short} not found.`;
      } else if (!!e.response?.data) {
        return `uh oh! there was an error:\n${JSON.stringify(
          e.response.data,
        )}\n`;
      }
      return e;
    }
  }
  try {
    const link = await newLink(args);
    return `visit: https://brill.wtf/${link}`;
  } catch (e) {
    if (!!e.response?.data) {
      return `uh oh! there was an error:\n${JSON.stringify(e.response.data)}\n`;
    }
    return e;
  }
};
