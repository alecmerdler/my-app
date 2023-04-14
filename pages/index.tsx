import { useEffect, useState } from "react";

export async function getServerSideProps() {
  const cloudSpacesResp = await fetch(
    "https://lightning.ai/v1/projects/01g1711t8e62kj12kxk55eptg6/cloudspaces",
    {
      headers: {
        Authorization: `Bearer ${process.env.LIGHTNING_TOKEN}`,
      },
    }
  );

  const cloudSpaces = await cloudSpacesResp.json();

  // Initially server-render the full list of CloudSpaces
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        props: {
          cloudSpaces,
        },
      });
      // NOTE(alecmerdler): This affects page load time...
    }, 100);
  });
}

type HomeProps = {
  cloudSpaces: any;
};

export default function Home(props: HomeProps) {
  const [latestCloudSpaces, setLatestCloudSpaces] = useState([]);

  // Fetch the latest CloudSpaces after the page has loaded and render those
  useEffect(() => {
    const effect = async () => {
      const cloudSpacesResp = await fetch(
        "https://lightning.ai/v1/projects/01g1711t8e62kj12kxk55eptg6/cloudspaces",
        {
          headers: {
            Authorization: `Bearer ${process.env.LIGHTNING_TOKEN}`,
          },
        }
      );

      const cloudSpaces = await cloudSpacesResp.json();

      setLatestCloudSpaces(cloudSpaces.cloudspaces);
    };

    effect();
  }, []);

  const cloudSpaces =
    latestCloudSpaces.length > 0
      ? latestCloudSpaces.slice(0, 1)
      : props.cloudSpaces.cloudspaces;

  return (
    <div>
      <h1>Home</h1>
      <div>
        {cloudSpaces.map((cs: any) => (
          <div key={cs.id}>
            <p>{cs.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
