import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
//import MyListBox from './components/listbox'
//import { } from './components/listbox'

type SynonymData = {
  word: string;
  score: number;
};

const modifier = [
  { id: 1, name: "Adjectives used for ", code: "jjb" },
  { id: 2, name: "Synonyms for ", code: "syn" },
  { id: 3, name: "Part of ", code: "par" },
  { id: 4, name: "Rhymes with ", code: "rhy" },
  { id: 5, name: "Homophones of ", code: "hom" },
];

function App() {
  const [word, setWord] = useState("");
  const [data, setData] = useState<SynonymData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  const [selectedModifier, setSelectedModifier] = useState({
    id: 0,
    name: "Select Option",
    code: "default",
  });
  console.log(selectedModifier);
  const code = selectedModifier.code;
  console.log(`the mod code is ${code}`);

  // const code = selectedModifier.code
  // console.log(code)

  const onButtonClicked = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const resData = await fetch(
      `https://api.datamuse.com/words?rel_${code}=${word}`
    );
    const synData = (await resData.json()) as SynonymData[];
    setIsLoading(false);
    console.log(synData);
    setData(synData);
    setButtonPressed(true);
  };

  const onListClick = async (listWord: string) => {
    setWord(listWord);
    setIsLoading(true);
    const resData = await fetch(
      `https://api.datamuse.com/words?rel_${code}=${word}`
    );
    const synData = (await resData.json()) as SynonymData[];
    setIsLoading(false);
    console.log(synData);
    setData(synData);
  };

  return (
    <div className="bg-slate-800 h-[100vh] flex justify-center items-center">
      <div className="flex flex-col">
        <div className="flex flex-row justify-center items-stretch">
          <div className="w-52 items-center">
            <Listbox value={selectedModifier} onChange={setSelectedModifier}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                  <span className="block truncate">
                    {selectedModifier.name}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    {modifier.map((modifier, modifierIdx) => (
                      <Listbox.Option
                        key={modifierIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-green-300 text-green-900"
                              : "text-gray-900"
                          }`
                        }
                        value={modifier}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {modifier.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-300">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <form className="pl-2 flex justify-evenly">
            <input
              className="rounded-lg text-center"
              value={word}
              placeholder="Enter Word Here"
              type="text"
              onChange={(e) => setWord(e.target.value)}
            ></input>
            <button
              className="bg-green-300 text-green-900 cursor-pointer ml-1 rounded-lg w-20"
              onClick={onButtonClicked}
            >
              Submit
            </button>
          </form>
        </div>
        <div className="flex flex-col items-stretch cursor-pointer mt-4 max-h-96 px-4">
          {isLoading ? (
            <p className="text-gray-300">Loading...</p>
          ) : (
            <>
              {buttonPressed && (
                <div className="border-b-2 border-gray-300 flex justify-center">
                  <p className="text-gray-300 font-bold">Results:</p>
                </div>
              )}
              <div className="overflow-y-auto flex justify-center">
                <ul className="list-disc text-gray-300">
                  {data.map((synonym) => {
                    return (
                      <li
                        key={synonym.word}
                        onClick={() => onListClick(synonym.word)}
                      >
                        {" "}
                        {synonym.word}{" "}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
