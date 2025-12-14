import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({
  title,
}: {
  title: string;
}) => (
  <Helmet>
    <title>{title}</title>
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
