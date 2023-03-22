<script>
  import {parsePageId} from 'notion-utils'
  import {domain} from "$lib/config";
  import {actions} from "../store";

  /** @type string */
  export let text;

  /** @type string */
  export let value;

  /** @type any*/
  export let linkProps = {};
  /** @type string */
  export let linkProtocol;

  const path = value.slice(1);
  const id = parsePageId(value.slice(1), {uuid: true})
  const getHashFragmentValue = (url) => {
    return url.includes('#') ? url.replace(/^.+(#.+)$/, '$1') : ''
  }

  let href = value;
  if ((value[0] === '/' || value.includes(domain)) && id) {
    href = value.includes((domain)) ? value : `${actions.mapPageUrl(id)}${getHashFragmentValue(value)}`;
  } else if (linkProtocol) {
    href = linkProtocol + ':' + value;
  }
</script>

<a href="{href}" {...linkProps} class='notion-link'>{text}</a>

