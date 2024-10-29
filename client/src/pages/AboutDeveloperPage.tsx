import {
  Avatar,
  Box,
  ButtonBase,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import linkedinIcon from "../assets/linkedin_icon.png";
import githubIcon from "../assets/github-icon.png";
import codeforcesIcon from "../assets/codeforces_icon.png";
import maherImage from "../assets/maher.png";
import { Link } from "react-router-dom";

const AboutDeveloperPage = () => {
  const { isTablet } = useWindowTypeContext();

  const [avatarSize, setAvatarSize] = useState(320);

  useEffect(() => {
    setAvatarSize(isTablet ? 200 : 320);
  }, [isTablet]);

  return (
    <Stack
      direction={isTablet ? "column-reverse" : "row"}
      alignItems="center"
      justifyContent="center"
      flex={1}
      spacing={4}
      padding={5}
      minHeight="100vh"
    >
      <Stack spacing={3}>
        <Typography variant="h4">Maher Majdoub</Typography>
        <Typography variant="h6" minHeight={35} color="primary">
          <Typewriter
            words={[
              "Computer Science Student",
              "Competetive Programmer",
              "Web Developer",
            ]}
            typeSpeed={50}
            loop
          />
        </Typography>
        <Typography maxWidth={700} fontSize={14}>
          As a computer science student at the Higher Institute of Computer
          Science Of Tunis (ISI), I’m immersed in the fundamentals of technology
          and its applications, continually expanding my knowledge in both
          theory and practice. With a passion for problem-solving, I’m dedicated
          to competitive programming, where I refine my logical thinking and
          algorithmic skills. My interest in web development drives me to create
          efficient, responsive, and user-focused applications, making me
          proficient in a range of tools and technologies. I’m committed to
          building innovative solutions and advancing my expertise in software
          development
        </Typography>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Linked-In">
            <ButtonBase>
              <Link
                to={"https://www.linkedin.com/in/maher-majdoub-220294256/"}
                target="_blank"
              >
                <Box width={25} height={25}>
                  <img src={linkedinIcon} />
                </Box>
              </Link>
            </ButtonBase>
          </Tooltip>
          <Tooltip title="GitHub">
            <ButtonBase>
              <Link to={"https://github.com/Maher-Majdoub"} target="_blank">
                <Box width={25} height={25}>
                  <img src={githubIcon} />
                </Box>
              </Link>
            </ButtonBase>
          </Tooltip>
          <Tooltip title="Codeforces">
            <ButtonBase>
              <Link
                to={"https://codeforces.com/profile/maherayari24"}
                target="_blank"
              >
                <Box width={25} height={25}>
                  <img src={codeforcesIcon} />
                </Box>
              </Link>
            </ButtonBase>
          </Tooltip>
        </Stack>
      </Stack>
      <Avatar src={maherImage} sx={{ width: avatarSize, height: avatarSize }} />
    </Stack>
  );
};

export default AboutDeveloperPage;
