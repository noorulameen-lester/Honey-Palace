import React from 'react';
import { SidebarSection, SidebarLink } from './SidebarComponents';
import { YourCertificateIcon } from './icons';

const SidebarLayout = () => {
  return (
    <div>
      {/* ...existing sections... */}
      <SidebarSection title="Analytics">
        {/* ...existing analytics links... */}
        <SidebarLink href="/admin/certificates" icon={<YourCertificateIcon />}>
          Certificates
        </SidebarLink>
      </SidebarSection>
      {/* ...existing sections... */}
    </div>
  );
};

export default SidebarLayout;