import { helper as buildHelper } from '@ember/component/helper';


export function url(url) {
  // remove protocol
  return url.toString().replace(/.*?:\/\//g, "");
}

export default buildHelper(url);
