import toast, { Toaster } from 'react-hot-toast';
export const showToast = (msg: string, status: string, toastId:string) => {
  if (status === "error") 
    setTimeout(
      () =>
        toast.error(msg, {
          id: toastId,
        }),
      400
    );
  else if (status === "success")
    setTimeout(
      () =>
        toast.success(msg, {
          id: toastId,
        }),
      400
    );
  else
    console.error("Something went wrong displaying the toast")
 
}


