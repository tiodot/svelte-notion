<script lang="ts">

import CheckboxIcon from './type-checkbox.svelte'
import DateIcon from './type-date.svelte'
import EmailIcon from './type-email.svelte'
import FileIcon from './type-file.svelte'
import FormulaIcon from './type-formula.svelte'
import MultiSelectIcon from './type-multi-select.svelte'
import NumberIcon from './type-number.svelte'
import PersonIcon from './type-person.svelte'
import Person2Icon from './type-person-2.svelte'
import PhoneNumberIcon from './type-phone-number.svelte'
import RelationIcon from './type-relation.svelte'
import SelectIcon from './type-select.svelte'
import TextIcon from './type-text.svelte'
import TimestampIcon from './type-timestamp.svelte'
import TitleIcon from './type-title.svelte'
import UrlIcon from './type-url.svelte'

export let type: typeof iconMap;

const iconMap = {
  title: TitleIcon,
  text: TextIcon,
  number: NumberIcon,
  select: SelectIcon,
  multi_select: MultiSelectIcon,
  date: DateIcon,
  person: PersonIcon,
  file: FileIcon,
  checkbox: CheckboxIcon,
  url: UrlIcon,
  email: EmailIcon,
  phone_number: PhoneNumberIcon,
  formula: FormulaIcon,
  relation: RelationIcon,
  created_time: TimestampIcon,
  last_edited_time: TimestampIcon,
  created_by: Person2Icon,
  last_edited_by: Person2Icon
}

const icon = iconMap[type]

</script>

<svelte:component this={icon}></svelte:component>