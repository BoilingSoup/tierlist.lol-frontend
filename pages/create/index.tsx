import {
  Box,
  Button,
  Center,
  CSSObject,
  FileButton,
  Flex,
  Image as MantineImage,
  List,
  Text,
  Tooltip,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useFullscreen, useViewportSize } from "@mantine/hooks";
import {
  IconDeviceFloppy,
  IconDownload,
  IconHelpCircle,
  IconMaximize,
  IconMaximizeOff,
  IconWorldUpload,
} from "@tabler/icons-react";
import type { NextPage } from "next";
import Head from "next/head";
import { RefObject, useRef, useState } from "react";
import { NAVBAR_HEIGHT } from "../../components/common/styles";
import { usePasteEvent } from "../../components/tierlist/hooks/usePasteEvent";
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

const buttonsSx: CSSObject = {
  width: "50%",
  height: "50%",
  display: "inline",
};

const buttonsContainer: CSSObject = {
  width: "100%",
  height: "20%",
};

const Create: NextPage = () => {
  const {
    toggle: toggleFullscreen,
    fullscreen,
    ref: fullscreenRef,
  } = useFullscreen();

  //
  const [data, setData] = useState<typeof initialData>(initialData);
  const { height } = useViewportSize();
  const rowHeight = fullscreen
    ? `${height / data.length}px`
    : `${(height - +NAVBAR_HEIGHT.split("px").shift()!) / data.length}px`;

  const [imageSources, setImageSources] = useState<Array<ClientSideImage>>([]);

  /**
   *
   * Move these later
   *
   */

  usePasteEvent(setImageSources);

  const resetRef = useRef<() => void>(null);

  return (
    <>
      <Head>
        <title>Create Tier List</title>
      </Head>
      <Flex
        ref={fullscreenRef}
        sx={{
          width: "100%",
          height: `calc(100vh - ${NAVBAR_HEIGHT})`,
        }}
      >
        <Box
          sx={(theme) => ({
            width: "75%",
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
            width: "25%",
            backgroundColor: theme.colors.dark[4],
            color: "white",
          })}
        >
          <Center
            sx={(theme) => ({
              width: "100%",
              height: "80%",
              background: theme.colors.dark[4],
            })}
          >
            <Box
              sx={{
                // height: "calc(100% - 1.5vw)",
                // width: "calc(100% - 1.5vw)",
                height: "95%",
                width: "95%",
                margin: "auto",
                border: "2px solid orange",
                borderRadius: "8px",
                flexDirection: "column",
              }}
            >
              <Center
                sx={{
                  height: "90%",
                  width: "100%",
                }}
              >
                <Flex
                  sx={{
                    height: "95%",
                    width: "95%",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                    overflow: "auto",
                  }}
                >
                  {!imageSources.length && (
                    <Center
                      sx={{
                        height: "100%",
                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <Text component="h2" sx={{ fontSize: "1.8rem" }}>
                        Add Images Here!
                      </Text>
                      <br />
                      <List
                        sx={{
                          color: "white",
                          fontSize: "1.3rem",
                        }}
                        styles={{ itemWrapper: { marginTop: "30px" } }}
                      >
                        <List.Item>Copy/Paste images or URLs</List.Item>
                        <List.Item>
                          Use the button below to upload files
                        </List.Item>
                      </List>
                    </Center>
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
              </Center>
              <Center sx={{ height: "10%" }}>
                <FileButton
                  resetRef={resetRef}
                  onChange={(files) => {
                    const newImages: ClientSideImage[] = files.map((file) => ({
                      id: useClientSideImageID.getState().getID(),
                      src: URL.createObjectURL(file),
                    }));
                    console.log(newImages);
                    setImageSources((prev) => [...prev, ...newImages]);

                    if (resetRef.current !== null) {
                      resetRef.current();
                    }
                  }}
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                >
                  {(props) => <Button {...props}>Upload image</Button>}
                </FileButton>
              </Center>
            </Box>
          </Center>
          <Box sx={buttonsContainer}>
            <Center component="button" sx={buttonsSx}>
              <IconDownload />
              <Text>Export PNG</Text>
            </Center>
            <Center
              component="button"
              sx={buttonsSx}
              onClick={toggleFullscreen}
            >
              {fullscreen ? <IconMaximizeOff /> : <IconMaximize />}
              <Text>{fullscreen ? "Exit" : "Enter"} Full Screen</Text>
            </Center>
            <Center component="button" sx={buttonsSx}>
              <IconDeviceFloppy />
              <Text>Save</Text>
            </Center>
            <Center component="button" sx={buttonsSx}>
              <IconWorldUpload />
              <Text>Publish</Text>
            </Center>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Create;
