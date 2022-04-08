import { useState } from "react";

import { EyeOffIcon, EyeIcon } from "@heroicons/react/outline";

import { MnemonicWordsDisplayer } from "src/components/MnemonicWordDisplayer";
import { CopyCommand } from "src/pages/Instructions/components";

interface Props {
  mnemonic: string;
  xpub: string;
  setWatchOnly: (value: boolean) => void;
  watchOnly: boolean
}
// WatchOnly prop help users toggle between the wallet mode they would prefer
export default function Settings({ mnemonic, xpub, setWatchOnly, watchOnly }: Props) {
  const [showMnemonic, setShowMnemonic] = useState(false);

  const CurrentEyeIcon = showMnemonic ? EyeIcon : EyeOffIcon;

  return (
    <main className="flex-1">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 bg-white shadow rounded-md mt-8">
            <h1 className="text-xl font-semibold text-gray-900 pt-8 inline-block">
              Wallet mnemonic
            </h1>

            {mnemonic && (
              <CurrentEyeIcon
                className="flex-shrink-0 h-9 w-9 rounded-full text-gray-400 p-1 -mt-1 inline-block ml-2 cursor-pointer hover:bg-gray-50 hover:text-gray-500"
                aria-hidden="true"
                onClick={() => setShowMnemonic(!showMnemonic)}
              />
            )}

            <div className="py-12">
              {showMnemonic && (
                <>
                  <MnemonicWordsDisplayer mnemonicWords={mnemonic} />
                  <div className="mt-4">Click to copy mnemonic: </div>
                  <CopyCommand command={mnemonic} showCommandArrow={true} />
                </>
              )}

              <h1 className="text-xl font-semibold text-gray-900 pt-8 inline-block">
                Wallet xpub
              </h1>
              <div className="mt-4">Click to copy xpub: </div>
              <CopyCommand command={xpub} showCommandArrow={true} />
            </div>
            <div className="flex flex-col py-5">
              <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Watch Only Mode</h2>
              <button className={`px-6 py-1 rounded-md ${watchOnly ? "bg-green-400" : "bg-red-400"}`} onClick={() => setWatchOnly(!watchOnly)}>{watchOnly ? "Activated": "Deactivated"}</button>
              </div>
              <span className="text-xs text-gray-500">Click to change Wallet Mode</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
