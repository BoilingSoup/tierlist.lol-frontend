import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { SaveTierListResponse, TierListData, TierListSchema } from "../../components/tierlist/types";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { parse } from "valibot";
import { showSomethingWentWrongNotification } from "../../components/common/helpers";
import { useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { useServerTierListStore } from "../store/useServerTierListStore";
import { checkForDiff } from "../../components/tierlist/helpers";

// Checks cache first to avoid unnecessary queries.
// Using a zustand store because cache has additional derived data that is only relevant on the client.
export const useGetTierList = (uuid: string | undefined) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const [data, setData] = useState<TierListData>();

  const { cacheHit, serverData, setServerData } = useCheckServerCacheStore({ uuid, setData });

  const enabled = uuid !== undefined && !cacheHit;
  const queryObj = useQuery(queryKeys.tierList(uuid!), getTierList(uuid!), {
    cacheTime: 0, // get latest data from server every time
    staleTime: 0,
    enabled,
    onSuccess: (response) => {
      try {
        const tierListData = parse(TierListSchema, JSON.parse(response.data)); // throws error if it doesn't satisfy schema
        setServerData(tierListData);
        setData(tierListData);
      } catch (e) {
        showSomethingWentWrongNotification(theme);
        router.push("/");
      }
    },
    onError: () => {
      router.push("/404");
    },
  });

  const diff = checkForDiff({ clientData: data, serverData });

  return { data, setData, queryObj, diff };
};

function getTierList(id: string) {
  return async function () {
    const res = await apiClient.get<SaveTierListResponse>(`/tierlist/${id}`);
    return res.data;
  };
}

type CheckServerCacheParam = {
  uuid: string | undefined;
  setData: Dispatch<SetStateAction<TierListData | undefined>>;
};

const useCheckServerCacheStore = ({ uuid, setData }: CheckServerCacheParam) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const [cacheHit, setCacheHit] = useState(true);

  const serverCacheStore = useServerTierListStore((state) => state.responses);
  const [serverData, setServerData] = useState<TierListData>();

  useEffect(() => {
    if (uuid === undefined) {
      return;
    }
    const cached = serverCacheStore[uuid];

    if (cached !== undefined) {
      setCacheHit(true);
      try {
        const tierListData = parse(TierListSchema, JSON.parse(serverCacheStore[uuid].response.data));
        setServerData(tierListData);
        setData(tierListData);
      } catch (e) {
        showSomethingWentWrongNotification(theme);
        router.push("/");
      }
    } else {
      setCacheHit(false);
    }
  }, [uuid]);

  return { cacheHit, serverData, setServerData };
};
