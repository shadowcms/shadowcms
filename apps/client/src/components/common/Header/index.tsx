/**
 * Header Component
 *
 * @author ShadowCMS
 */

import React from 'react';
import loadable from '@loadable/component';
import MockUser from '../../../mocks/user';
import COLORS from '../../../styles/GlobalColors';
import { HeaderProps } from './types';
import { PencilAltIcon } from '@heroicons/react/outline';

/* Dynamic Components */
const Wrapper = loadable(() => import('../../../ui/Wrapper'));
const UserTab = loadable(() => import('../../../ui/UserTab'));
const Navigation = loadable(() => import('../Navigation'));
const Container = loadable(() => import('../../../ui/Container'));
const Logo = loadable(() => import('../../../ui/Logo'));
const Button = loadable(() => import('../../../ui/Button'));

const Header: React.FC<HeaderProps> = ({ isEditor }) => {
  return (
    <Container height={80} borderBottom={`1px solid ${COLORS.borders}`}>
      <Wrapper
        height="100%"
        justifyContent="space-between"
        alignItems="center"
        display="flex"
        padding="10px 0"
      >
        <Container gridGap="40px">
          <Logo size="md" />
          <Navigation direction="row" />
          {!isEditor && (
            <Button color="success" icon={<PencilAltIcon />}>
              Compose
            </Button>
          )}
        </Container>
        <UserTab user={MockUser} />
      </Wrapper>
    </Container>
  );
};

export default Header;
