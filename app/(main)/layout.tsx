import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'ENS MONITORING APP',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
    robots: { index: false, follow: false },
    // viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'ENS APP Framework',
        url: 'http://kiswire.com/',
        description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
        // images: ['https://www.primefaces.org/static/social/sakai-react.png'],
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}