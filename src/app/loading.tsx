import { Navbar } from '@/shared/components/layout';
import { Loading } from '@/shared/components/ui';

const LoadingPage = () => {
    return (
        <>
            <Navbar />
            <Loading fullScreen overlay={false} showLogo showLoader={false} />
        </>
    );
};

export default LoadingPage;
