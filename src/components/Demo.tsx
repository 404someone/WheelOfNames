"use client";

import { useEffect, useState } from "react";
import sdk, {
  type Context,
} from "@farcaster/frame-sdk";
import WheelOfNames from "./WheelOfNames";



export default function Demo(
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();




  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);

      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  
        if (!context?.user.fid)
          return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="flex flex-col items-center justify-center text-white text-2xl p-4">
              <p className="flex items-center justify-center text-center">
                you need to access this frame from inside a farcaster client
              </p>
              <p className="flex items-center justify-center text-center">
                (click on the logo to open in Farcaster)
              </p>
          
              <div className="flex items-center justify-center p-2 bg-white rounded-lg mt-4">
              <a href="https://warpcast.com/cashlessman.eth/0xcaf78007" target="_blank" rel="noopener noreferrer" className="shadow-lg shadow-white">
  <img 
    src="https://warpcast.com/og-logo.png"
    alt="Profile" 
    className="w-28 h-28 shadow-lg" 
  />
</a>

              </div>
            </div>
          </div>
          
          );

      return (
        <div style={{ 
          paddingTop: context?.client.safeAreaInsets?.top ?? 0, 
          paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
          paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
          paddingRight: context?.client.safeAreaInsets?.right ?? 0 ,
        }}>
<WheelOfNames />

      </div>
      );
    
}
