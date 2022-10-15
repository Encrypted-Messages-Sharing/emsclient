import { useSelector } from 'react-redux';
import { StoreState } from 'renderer/store';
import Messages from '../messages';
import Sidebar from '../sidebar';
import Wrapper from '../wrapper';
import HubPick from '../hubPick';
import Auth from '../auth';
import Notify from '../notify';

const Root = () => {
  const { pass, hub } = useSelector((state: StoreState) => ({
    pass: state.app.pass,
    hub: state.app.hub,
  }));

  let component = <></>;

  if (!pass) {
    component = <Auth />
  } else if (!hub) {
    component = <HubPick />
  } else {
    component = (
      <>
        <Sidebar />
        <Messages />
      </>
    )
  }

  return (
    <>
      <Wrapper>
        {component}
      </Wrapper>
      <Notify />
    </>
  );
};

export default Root;
