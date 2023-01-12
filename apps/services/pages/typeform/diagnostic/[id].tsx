import { Button } from '@mui/material';
import Head from 'next/head';

import Header from 'components/typeform/header/header';
import ContactUs from 'pages/typeform/Feedback';

import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';

import TitlesJson from 'pages/typeform/components/title.content.json';
import ResponsesJson from 'pages/typeform/components/responses.content.json';
import TextBLock from 'pages/typeform/components/TextBlock';

import styles from 'pages/typeform/form.module.scss';

const Result = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Responses: { [key: string]: any } = ResponsesJson;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Titles: { [key: string]: any } = TitlesJson;
  const { responses } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedResponses = responses.filter((response: any) => {
    return (
      (response.type === 'choice' && Responses[response.field.id][response.choice.id]) ||
      (response.type === 'boolean' && response.boolean === true)
    );
  });
  return (
    <div className={styles.container}>
      <Head>
        <title>Is Luos for You</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.containerContent}>
          <h1>{Titles[props.title.id]}</h1>
          <p>
            Thanks for answering these questions, it&#39;s always a pleasure to meet new users of
            Luos! Here is a <span className={styles.diagnosis}> personalized diagnosis</span> about
            how Luos can suit your needs:
          </p>
          {Object.keys(parsedResponses).map((key, index) =>
            parsedResponses[key].type === 'choice' ? (
              <TextBLock
                key={index}
                img={parsedResponses[key].field.id}
                text={Responses[parsedResponses[key].field.id][parsedResponses[key].choice.id]}
                align={(index + 2) % 2 === 0 ? 'left' : 'right'}
              />
            ) : parsedResponses[key].boolean === true ? (
              <TextBLock
                key={index}
                img={parsedResponses[key].field.id}
                text={Responses[parsedResponses[key].field.id]}
                align={(index + 2) % 2 === 0 ? 'left' : 'right'}
              />
            ) : null,
          )}
          <p>
            To go a step further you can reach us and explain your project on our community our via
            this form. We&#39;ll be glad to bring you with some more advices. See you soon!
          </p>
          <div className={styles.btnContainer}>
            <Button
              className={`${styles.socialBtn} ${styles.discord}`}
              href="http://bit.ly/JoinLuosDiscord"
              target="_blank"
            >
              <i className="fab fa-discord" />
              Discord
            </Button>
            <Button
              className={`${styles.socialBtn} ${styles.reddit}`}
              href="https://www.reddit.com/r/Luos/"
              target="_blank"
            >
              <i className="fab fa-reddit-alien" />
              Reddit
            </Button>
          </div>
          <ContactUs />
          <p className={styles.mention}>
            This informations will be used for diagnosis purpose only. None of it will be shared or
            use for marketing purposes.
          </p>
          <p className={styles.habits}>
            If you still have five minutes... Here is a quick and anonymous form that can help us
            learn more about your development habits:{' '}
            <a href="https://luos.typeform.com/to/pIUABBPF" rel="noreferrer" target="_blank">
              how do you dev{' '}
            </a>
            ? Thanks for your help!
          </p>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const { id } = query;
  const res = await fetch(
    'https://api.typeform.com/forms/QMXQbzmh/responses?included_response_ids=' + id,
    {
      headers: {
        Authorization: 'Bearer ' + process.env.TYPEFORM_ACCESS_TOKEN,
      },
    },
  );
  const data = await res.json();
  const title = data.items[0].answers[3].choice;
  data.items[0].answers.splice(3, 1);
  data.items[0].answers.push(data.items[0].answers.shift());
  const responses = data.items[0].answers;
  return {
    props: {
      title,
      responses,
    },
  };
};

export default Result;
