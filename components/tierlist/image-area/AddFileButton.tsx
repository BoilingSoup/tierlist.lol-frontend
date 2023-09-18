import { Button, FileButton, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { useIsDesktopScreen } from "../../common/hooks/useIsDesktopScreen";
import { addFileButtonStyles, addFileButtonSx, addFileButtonTextSx } from "../styles";
import { ClientSideImage } from "../types";
import { compressImage } from "../helpers";

type Props = {
  onAddImage: (images: ClientSideImage[]) => void;
};

export const AddFileButton = ({ onAddImage: setImageSources }: Props) => {
  const resetRef = useRef<() => void>(null);
  const isDesktopScreen = useIsDesktopScreen();

  const addFileHandler = async (files: File[]) => {
    try {
      const compressedImages: Promise<ClientSideImage>[] = files.map(async (file) => {
        const compressed = await compressImage(file);

        return {
          id: nanoid(),
          src: URL.createObjectURL(compressed),
        };
      });

      // TODO: write to IDB ...

      const newImages = await Promise.all(compressedImages);
      setImageSources(newImages);

      if (resetRef.current !== null) {
        resetRef.current();
      }
    } catch (e) {
      // TODO: handle error
    }
  };

  return (
    <FileButton resetRef={resetRef} onChange={addFileHandler} accept="image/png,image/jpeg,image/webp" multiple>
      {(props) => (
        <Button {...props} sx={addFileButtonSx} styles={addFileButtonStyles}>
          {isDesktopScreen ? (
            <>
              <IconPlus />
              Add Files
            </>
          ) : (
            <Stack w="100%">
              <IconPlus size="50" style={{ margin: "auto" }} />
              <Text component="span" sx={addFileButtonTextSx}>
                Add Files
              </Text>
            </Stack>
          )}
        </Button>
      )}
    </FileButton>
  );
};
