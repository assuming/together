// export function getContributorColor(name: string) {
//   let color: string = 'white';
//   let opacity: number = 0.15;
//   switch (name) {
//     case 'madongsheng':
//     case '马东升':
//       color = '#0099FF';
//       opacity = 0.8;
//       break;
//     case 'liutongyang':
//     case '刘彤阳':
//       color = '#AD33FF';
//       opacity = 0.8;
//       break;
//     case '陈思宇':
//     case 'Siyu Chen':
//       color = '#FF1414';
//       opacity = 0.8;
//       break;
//     case '王明晓':
//     case 'ohmyxm':
//       color = '#3338F0';
//       opacity = 0.8;
//       break;
//     case '陆爱松':
//     case 'luaisong':
//       color = '#31E33F';
//       opacity = 0.8;
//       break;
//     case 'wanghe.ustc':
//     case '王贺':
//       color = '#FFBB00';
//       opacity = 0.8;
//       break;
//     case '李旸根本没有':
//       color = '#0FFFE7';
//       opacity = 0.8;
//       break;
//     case '程亦直':
//     case 'chengyizhi':
//       color = '#FF00BB';
//       opacity = 0.8;
//       break;
//     case 'majunchen':
//       color = '#05FF97';
//       opacity = 0.8;
//       break;
//     case 'liyubei':
//       color = '#0FFFE7';
//       opacity = 0.8;
//       break;
//     default:
//       break;
//   }

//   return {
//     color,
//     opacity
//   };
// }

export function getContributorColor(name: string) {
  let color: string = 'white';
  let opacity: number = 0.15;
  switch (name) {
    case 'Brendan Forster':
      color = '#0099FF';
      opacity = 0.8;
      break;
    case 'Markus Olsson':
      color = '#AD33FF';
      opacity = 0.8;
      break;
    case 'joshaber':
      color = '#FF1414';
      opacity = 0.8;
      break;
    case 'William Shepherd':
    case 'iAmWillShepherd':
      color = '#3338F0';
      opacity = 0.8;
      break;
    case 'evelyn masso':
      color = '#31E33F';
      opacity = 0.8;
      break;
    case 'Don Okuda':
      color = '#FFBB00';
      opacity = 0.8;
      break;
    case 'Josh Abernathy':
      color = '#0FFFE7';
      opacity = 0.8;
      break;
    case 'Jed Fox':
      color = '#FF00BB';
      opacity = 0.8;
      break;
    case 'Billy Griffin':
      color = '#05FF97';
      opacity = 0.8;
      break;
    default:
      break;
  }

  return {
    color,
    opacity
  };
}
