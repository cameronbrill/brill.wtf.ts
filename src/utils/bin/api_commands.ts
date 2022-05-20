import { getProjects, getQuote, getReadme, getWeather, newLink } from '../api';

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
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather casablanca';
  }
  const weather = await getWeather(city);
  return weather;
};

export const link = async (args: string[]): Promise<string> => {
  const linkInput = {
    original: args[0],
    want: args[1],
  };

  const usage = 'Usage: link [original] [want]';
  if (!linkInput.original) {
    return `${usage}. Example: \n$ link https://youtu.be/dQw4w9WgXcQ video\n$ > https://brill.wtf/video`;
  }

  var validURL = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  if (!validURL.test(linkInput.original)) {
    return `${usage}. [link] must be a valid URL.`;
  }

  try {
    const link = await newLink(linkInput);
    return `visit: https://brill.wtf/${link}`;
  } catch (e) {
    return `uh oh! there was an error:\n${JSON.stringify(e.response.data)}\n`;
  }
};
