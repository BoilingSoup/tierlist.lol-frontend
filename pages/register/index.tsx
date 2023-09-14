import { Title, Center, Flex, Text } from "@mantine/core";
import { NextPage } from "next";
import { authTitleSx, formContainerSx, formPageContainerSx, oauthContainerSx } from "../../components/forms/styles";
import { FormPageBackground } from "../../components/forms/FormPageBackground";
import { FormTabs } from "../../components/forms/FormTabs";
import { RegisterForm } from "../../components/forms/RegisterForm";
import { OAuthIconsGroup } from "../../components/forms/OAuthIconsGroup";
import { useRedirectIfAuthenticated } from "../../components/common/hooks/useRedirectIfAuthenticated";
import { useAuth } from "../../contexts/AuthProvider";

const Register: NextPage = () => {
  const { user, isLoading } = useAuth();
  useRedirectIfAuthenticated({ user, isLoading, redirectTo: "/" });

  return (
    <Center sx={formPageContainerSx}>
      <FormPageBackground />
      <Flex sx={formContainerSx}>
        <Title sx={authTitleSx}>Registration</Title>
        <FormTabs />
        <RegisterForm />
        <Center sx={oauthContainerSx}>
          <Text size="md">Or register with</Text>
          <OAuthIconsGroup />
        </Center>
      </Flex>
    </Center>
  );
};

export default Register;
