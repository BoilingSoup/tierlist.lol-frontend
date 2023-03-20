import {
  ActionIcon,
  Box,
  Center,
  Flex,
  Image as MantineImage,
  Text,
} from "@mantine/core";
import { useViewportSize, useWindowEvent } from "@mantine/hooks";
import {
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from "@tabler/icons-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Split from "react-split";
import { NAVBAR_HEIGHT } from "../../components/common/styles";
import { TierListRow } from "../../components/tierlist/TierListRow";
import {
  ClientSideImage,
  TierListRowProps,
} from "../../components/tierlist/types";
import { useClientSideImageID } from "../../hooks/store/useClientSideImageID";

const initialData: (Omit<TierListRowProps, "height"> & { key: number })[] = [
  { key: 1, color: "#fe7f7f", label: "S", items: [] },
  { key: 2, color: "#febe7e", label: "A", items: [] },
  { key: 3, color: "#fefe7f", label: "B", items: [] },
  { key: 4, color: "#7fff7f", label: "C", items: [] },
  { key: 5, color: "#7fbfff", label: "D", items: [] },
];

const Create: NextPage = () => {
  const [data, setData] = useState<typeof initialData>(initialData);
  const { width, height } = useViewportSize();
  const rowHeight = `${
    (height - +NAVBAR_HEIGHT.split("px").shift()!) / data.length
  }px`;

  const [collapseIndex, setCollapseIndex] = useState<number | undefined>(
    undefined
  );

  const [imageSources, setImageSources] = useState<Array<ClientSideImage>>([]);
  useWindowEvent("paste", (event: Event) => {
    if (!(event instanceof ClipboardEvent)) {
      return;
    }
    if (!event.clipboardData?.files?.length) {
      return;
    }
    if (event.clipboardData.files.length <= 0) {
      return;
    }

    const file = event.clipboardData.files[0];
    if (file.type.startsWith("image/")) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        // TODO: compress/resize images before displaying

        // let img = new Image();
        // img.onload = () => {
        // console.log(img.width);
        // console.log(img.height);
        // };
        setImageSources((prev) => [
          ...prev,
          {
            id: useClientSideImageID.getState().getID(),
            src: fileReader.result as string,
          },
        ]);
        // img.src = fileReader.result as string;
      };

      fileReader.readAsDataURL(file);
    }
  });

  return (
    <>
      <Head>
        <title>Create Tier List</title>
      </Head>
      <Flex sx={{ width: "100%", height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
        <Split
          sizes={[70, 30]} // might need dynamic state for TODO below
          maxSize={[Infinity, width * 0.4]}
          collapsed={collapseIndex}
          onDragEnd={(sizes) => console.log(sizes)} // TODO: make collapse/uncollapse size more reactive to current size.
          dragInterval={1}
          direction="horizontal"
          style={{ height: "100%", width: "100%", display: "flex" }}
        >
          <Box
            sx={(theme) => ({
              backgroundColor: theme.colors.dark[7],
              overflow: "auto",
            })}
          >
            {data.map((row) => (
              <TierListRow
                key={row.key}
                label={row.label}
                items={row.items}
                color={row.color}
                height={rowHeight}
              />
            ))}
          </Box>
          <Box
            sx={(theme) => ({
              backgroundColor: theme.colors.dark[4],
              color: "white",
            })}
          >
            <ActionIcon
              variant="outline"
              size="xl"
              sx={(theme) => ({
                color: "white",
                margin: theme.spacing.xs,
                ":hover": {
                  backgroundColor: "initial",
                },
              })}
              title={
                collapseIndex === undefined
                  ? "Collapse Side Menu"
                  : "Expand Side Menu"
              }
              onClick={() => setCollapseIndex((prev) => (prev ? undefined : 1))}
            >
              {collapseIndex === undefined ? (
                <IconLayoutSidebarRightCollapse />
              ) : (
                <IconLayoutSidebarRightExpand />
              )}
            </ActionIcon>
            <Flex sx={{ flexWrap: "wrap" }}>
              {!imageSources.length && collapseIndex === undefined && (
                <Text>No Images!</Text>
              )}
              {imageSources.map((img) => (
                <Center
                  key={img.id}
                  sx={{
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    border: "2px solid white",
                    margin: "1px",
                  }}
                >
                  <MantineImage
                    src={img.src}
                    // width={100}
                    // height={100}
                    sx={{ height: "auto", width: "100px" }}
                  />
                </Center>
              ))}
            </Flex>
          </Box>
        </Split>
      </Flex>
    </>
  );
};

export default Create;
