import { FaMagnifyingGlass } from 'react-icons/fa6';
import * as Combobox from '@reach/combobox';

export default function LocationAdder() {
  return (
    <Combobox.Combobox>
      <div className="relative">
        <FaMagnifyingGlass className='absolute top-3 left-3' />
        <Combobox.ComboboxInput className='quiz-builder-location-adder' />
      </div>
      <Combobox.ComboboxPopover>
        <Combobox.ComboboxList>
          <Combobox.ComboboxOption value="Apple" />
          <Combobox.ComboboxOption value="Banana" />
        </Combobox.ComboboxList>
      </Combobox.ComboboxPopover>
    </Combobox.Combobox>
  );
}