import { Metadata } from "next";
import App from "~/app/app";

const appUrl = process.env.NEXT_PUBLIC_URL;

export const revalidate = 300;



export async function generateMetadata({
}): Promise<Metadata> {
  
  const frame = {
    version: "next",
    imageUrl:`${appUrl}/cover.png`,  
        button: {
      title: `Open wheel of names`,
    action: {
      type: "launch_frame",
      name: "Wheel of Names",
      url: appUrl,
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#8660cc",
      },
    },
  };

  return {
    title: "Wheel of Names",
    openGraph: {
      title: "Wheel of Names by cashlessman.eth",
      description: "Wheel of Names by cashlessman.eth",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (<App />);
}


