/**
 * @description Function to save entire article and keep it up to date
 * @author ShadowCMS
 */

import dayjs from 'dayjs';
import { firestore } from '../../../services/firebase';

async function saveArticle({ dispatch, editor, id, articleState }: any) {
  await dispatch({
    type: 'SET_ARTICLE_SAVING',
    payload: {
      saving: true,
    },
  });

  await dispatch({
    type: 'SET_ARTICLE_BODY',
    payload: {
      body: `${editor?.getHTML()}`,
    },
  });

  setTimeout(async () => {
    const ref = await firestore.collection('articles').doc(id);

    await firestore
      .runTransaction((transaction) => {
        return transaction.get(ref).then((doc) => {
          if (!doc.exists) {
            // eslint-disable-next-line no-throw-literal
            throw 'Document does not exist!';
          }

          /**
           * Update entire article document, not just article body
           */
          transaction.set(ref, {
            ...articleState,
            lastUpdated: dayjs().format('YYYY-MM-DDTHH:mm:ss') as string,
            doc: {
              ...articleState?.doc,
              body: `${editor?.getHTML()}`,
            },
          });
        });
      })
      .then(() => {
        dispatch({
          type: 'SET_ARTICLE_SAVING',
          payload: {
            saving: false,
          },
        });
      });
  }, 200);
}

export default saveArticle;
