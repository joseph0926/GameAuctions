import { ChangeEvent, FC, ReactElement, useState } from 'react';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import Alert from '@/shared/Alert';
import Button from '@/shared/Button';
import { updateCategoryContainer } from '@/shared/header/reducers/category.reducer';
import { updateHeader } from '@/shared/header/reducers/header.reducer';
import Input from '@/shared/Input';
import { IModalBgProps } from '@/shared/interfaces/modal.interface';
import ModalBg from '@/shared/modals/ModalBg';
import { IResponse } from '@/shared/interfaces/shared.interface';
import { saveToSessionStorage } from '@/shared/utils/utils.service';
import { useAppDispatch } from '@/store/store';

import { useAuthSchema } from '@/features/auth/hooks/useAuthSchema';
import { ISignInPayload } from '@/features/auth/interfaces/auth.interface';
import { addAuthUser } from '@/features/auth/reducers/auth.reducer';
import { updateLogout } from '@/features/auth/reducers/logout.reducer';
import { loginUserSchema } from '@/features/auth/schemes/auth.schema';
import { useSignInMutation } from '@/features/auth/services/auth.service';

const LoginModal: FC<IModalBgProps> = ({ onClose, onToggle, onTogglePassword }): ReactElement => {
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [passwordType, setPasswordType] = useState<string>('password');
  const [userInfo, setUserInfo] = useState<ISignInPayload>({
    username: '',
    password: ''
  });
  const dispatch = useAppDispatch();
  const [schemaValidation] = useAuthSchema({ schema: loginUserSchema, userInfo });
  const [signIn, { isLoading }] = useSignInMutation();

  const onLoginUser = async (): Promise<void> => {
    try {
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        const result: IResponse = await signIn(userInfo).unwrap();
        setAlertMessage('');
        dispatch(addAuthUser({ authInfo: result.user }));
        dispatch(updateLogout(false));
        dispatch(updateHeader('home'));
        dispatch(updateCategoryContainer(true));
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(result.user?.username));
      }
    } catch (error) {
      setAlertMessage(error?.data.message);
    }
  };

  return (
    <ModalBg>
      <div className="relative top-[20%] mx-auto w-11/12 max-w-md rounded-lg bg-white md:w-2/3">
        <div className="relative px-5 py-5">
          <div className="mb-5 flex justify-between text-2xl font-bold text-gray-600">
            <h1 className="flex w-full justify-center">Sign In to Barca</h1>
            <Button
              testId="closeModal"
              className="cursor-pointer rounded text-gray-400 hover:text-gray-600"
              role="button"
              label={<FaTimes className="icon icon-tabler icon-tabler-x" />}
              onClick={onClose}
            />
          </div>
          {alertMessage && <Alert type="error" message={alertMessage} />}
          <div>
            <label htmlFor="email or username" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
              Email or username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              value={userInfo.username}
              className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-orange-500/50 focus:outline-none"
              placeholder="Enter email or username"
              onChange={(event: ChangeEvent) => {
                setUserInfo({ ...userInfo, username: (event.target as HTMLInputElement).value });
              }}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
              Password
            </label>
            <div className="relative mb-2 mt-2">
              <div className="absolute right-0 flex h-full cursor-pointer items-center pr-3 text-gray-600">
                {passwordType === 'password' ? (
                  <FaEyeSlash onClick={() => setPasswordType('text')} className="icon icon-tabler icon-tabler-info-circle" />
                ) : (
                  <FaEye onClick={() => setPasswordType('password')} className="icon icon-tabler icon-tabler-info-circle" />
                )}
              </div>
              <Input
                id="password"
                name="password"
                type={passwordType}
                value={userInfo.password}
                className="flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-orange-500/50 focus:outline-none"
                placeholder="Enter password"
                onChange={(event: ChangeEvent) => {
                  setUserInfo({ ...userInfo, password: (event.target as HTMLInputElement).value });
                }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <div
              onClick={() => {
                if (onTogglePassword) {
                  onTogglePassword(true);
                }
              }}
              className="mb-6 ml-2 cursor-pointer text-sm text-red-600 hover:underline dark:text-red-500"
            >
              Forgot Password?
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <Button
              testId="submit"
              disabled={!userInfo.username || !userInfo.password}
              className={`text-md block w-full cursor-pointer rounded bg-orange-500 px-8 py-2 text-center font-bold text-white hover:bg-orange-400 focus:outline-none ${
                !userInfo.username || !userInfo.password ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              label={`${isLoading ? 'LOGIN IN PROGRESS...' : 'LOGIN'}`}
              onClick={onLoginUser}
            />
          </div>
        </div>
        <hr />
        <div className="px-5 py-4">
          <div className="ml-2 flex w-full justify-center text-sm font-medium">
            <div className="flex justify-center">
              Not yet a memeber?{' '}
              <p
                onClick={() => {
                  if (onToggle) {
                    onToggle(true);
                  }
                }}
                className="ml-2 flex cursor-pointer text-red-600 hover:underline"
              >
                Join Now
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default LoginModal;
