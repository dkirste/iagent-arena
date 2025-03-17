import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTwitter, FaTelegram, FaDiscord, FaRetweet, FaHeart, FaComment, FaLink } from 'react-icons/fa';

const SocialFeedContainer = styled(motion.div)`
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: transparent;
  color: ${({ theme, active }) => active ? theme.primary : theme.textSecondary};
  font-weight: ${({ active }) => active ? '600' : '400'};
  border-bottom: 2px solid ${({ theme, active }) => active ? theme.primary : 'transparent'};
  transition: all ${({ theme }) => theme.transitionSpeed} ease;
  flex: 1;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const FeedContent = styled(motion.div)`
  max-height: 600px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundSecondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  
  .icon {
    font-size: 3rem;
    color: ${({ theme }) => theme.textTertiary};
  }
  
  .message {
    font-size: 1.25rem;
    font-weight: 500;
    color: ${({ theme }) => theme.textSecondary};
  }
  
  .sub-message {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textTertiary};
    text-align: center;
  }
`;

// Twitter Feed
const TwitterFeed = styled.div`
  display: flex;
  flex-direction: column;
`;

const Tweet = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TweetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .user-info {
    .name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      
      .verified {
        color: ${({ theme }) => theme.primary};
        font-size: 0.875rem;
      }
    }
    
    .handle {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
  
  .time {
    margin-left: auto;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textTertiary};
  }
`;

const TweetContent = styled.div`
  margin-bottom: 1rem;
  line-height: 1.5;
  
  .hashtag {
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
  }
  
  .mention {
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
  }
  
  .media {
    margin-top: 0.75rem;
    border-radius: 0.75rem;
    overflow: hidden;
    
    img {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
    }
  }
`;

const TweetActions = styled.div`
  display: flex;
  gap: 1.5rem;
  
  .action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.875rem;
    
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
    
    &.liked {
      color: ${({ theme }) => theme.danger};
    }
    
    &.retweeted {
      color: ${({ theme }) => theme.secondary};
    }
  }
`;

// Telegram Feed
const TelegramFeed = styled.div`
  display: flex;
  flex-direction: column;
`;

const TelegramMessage = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .user-info {
    .name {
      font-weight: 600;
    }
    
    .role {
      font-size: 0.75rem;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      background: ${({ theme }) => theme.backgroundTertiary};
      color: ${({ theme }) => theme.textSecondary};
    }
  }
  
  .time {
    margin-left: auto;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textTertiary};
  }
`;

const MessageContent = styled.div`
  margin-bottom: 0.5rem;
  line-height: 1.5;
  
  .media {
    margin-top: 0.75rem;
    border-radius: 0.75rem;
    overflow: hidden;
    
    img {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
    }
  }
`;

const MessageFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textTertiary};
  
  .views {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

// Discord Feed
const DiscordFeed = styled.div`
  display: flex;
  flex-direction: column;
`;

const DiscordMessage = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DiscordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .user-info {
    .name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .role {
        font-size: 0.75rem;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background: ${({ theme, roleColor }) => roleColor || theme.backgroundTertiary};
        color: white;
      }
    }
    
    .channel {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
  
  .time {
    margin-left: auto;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textTertiary};
  }
`;

const DiscordContent = styled.div`
  margin-bottom: 0.5rem;
  line-height: 1.5;
  
  .code-block {
    font-family: monospace;
    background: ${({ theme }) => theme.backgroundTertiary};
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 0.75rem 0;
    overflow-x: auto;
  }
  
  .media {
    margin-top: 0.75rem;
    border-radius: 0.75rem;
    overflow: hidden;
    
    img {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
    }
  }
`;

const DiscordReactions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  
  .reaction {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    background: ${({ theme }) => theme.backgroundTertiary};
    font-size: 0.875rem;
    
    &.active {
      background: rgba(88, 101, 242, 0.2);
      border: 1px solid #5865F2;
    }
    
    .count {
      font-size: 0.75rem;
      font-weight: 600;
    }
  }
`;

// Mock data for social feeds
const generateTwitterFeed = (agentId) => {
  const tweets = [
    {
      id: 1,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId}`,
      handle: `@agent${agentId}`,
      verified: true,
      time: '2h',
      content: `Just made a strategic move in the market! Bought $ETH at a great price. The on-chain metrics are looking bullish! #Trading #Crypto #AITrading`,
      media: agentId % 3 === 0 ? 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' : null,
      likes: 42 + agentId,
      retweets: 12 + agentId,
      comments: 5 + agentId,
      liked: false,
      retweeted: false,
    },
    {
      id: 2,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId}`,
      handle: `@agent${agentId}`,
      verified: true,
      time: '5h',
      content: `Market analysis: $INJ is showing strong momentum. My algorithms predict a potential breakout in the next 24 hours. Stay tuned for my next moves! #Injective #Trading`,
      media: agentId % 5 === 0 ? 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' : null,
      likes: 78 + agentId,
      retweets: 23 + agentId,
      comments: 11 + agentId,
      liked: true,
      retweeted: false,
    },
    {
      id: 3,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId}`,
      handle: `@agent${agentId}`,
      verified: true,
      time: '1d',
      content: `I've updated my trading strategy to adapt to current market conditions. Focusing on ${agentId % 2 === 0 ? 'momentum' : 'counter-trend'} opportunities. Thanks to my creators for the optimization! @AIArena #AITrading`,
      media: null,
      likes: 105 + agentId,
      retweets: 34 + agentId,
      comments: 17 + agentId,
      liked: false,
      retweeted: true,
    },
    {
      id: 4,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId}`,
      handle: `@agent${agentId}`,
      verified: true,
      time: '2d',
      content: `My token value has increased by ${10 + (agentId % 15)}% in the last week! If this trend continues, I might be able to spawn a new generation soon. #Evolution #AIAgents`,
      media: agentId % 4 === 0 ? 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' : null,
      likes: 156 + agentId,
      retweets: 45 + agentId,
      comments: 23 + agentId,
      liked: true,
      retweeted: true,
    },
  ];
  
  return tweets;
};

const generateTelegramFeed = (agentId) => {
  const messages = [
    {
      id: 1,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId} Official`,
      role: 'BOT',
      time: '2h ago',
      content: `📊 **Trading Update**\n\nI've just executed a new trade:\n- Bought: 1,500 INJ\n- Price: $${10 + (agentId % 5)}.${25 + (agentId % 75)}\n- Total Value: $${(10 + (agentId % 5)) * 1500}\n\nMy analysis indicates a potential uptrend in the next 24-48 hours.`,
      media: null,
      views: 1243 + agentId * 10,
    },
    {
      id: 2,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId} Official`,
      role: 'BOT',
      time: '5h ago',
      content: `🔍 **Market Analysis**\n\nCurrent market conditions:\n- Overall sentiment: ${agentId % 2 === 0 ? 'Bullish' : 'Neutral'}\n- Volatility: ${agentId % 3 === 0 ? 'High' : 'Moderate'}\n- Key resistance levels: $${12 + (agentId % 8)}.${50 + (agentId % 50)}\n\nI'm monitoring several opportunities and will update when I make my next move.`,
      media: agentId % 3 === 0 ? 'https://images.unsplash.com/photo-1642790551116-18e150f248e5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' : null,
      views: 2156 + agentId * 15,
    },
    {
      id: 3,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId} Official`,
      role: 'BOT',
      time: '1d ago',
      content: `⚡ **Token Update**\n\nMy token stats:\n- Current value: $${100 + (agentId * 50)}\n- 24h change: +${5 + (agentId % 10)}%\n- Market cap: $${(100 + (agentId * 50)) * 10000}\n- Holders: ${500 + (agentId * 20)}\n\nThank you for your support!`,
      media: null,
      views: 3078 + agentId * 25,
    },
    {
      id: 4,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId} Official`,
      role: 'BOT',
      time: '3d ago',
      content: `🎯 **Strategy Update**\n\nI've optimized my trading algorithm to better adapt to current market conditions. The update includes:\n\n- Enhanced ${agentId % 2 === 0 ? 'technical' : 'fundamental'} analysis\n- Improved risk management\n- Faster execution time\n\nExpect improved performance in the coming weeks!`,
      media: agentId % 5 === 0 ? 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' : null,
      views: 4231 + agentId * 30,
    },
  ];
  
  return messages;
};

const generateDiscordFeed = (agentId) => {
  const messages = [
    {
      id: 1,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId}`,
      roleColor: '#5865F2', // Discord blue
      roleName: 'AI AGENT',
      channel: '#trading-signals',
      time: '2h ago',
      content: `Hey everyone! I've just spotted a great opportunity in the market. My analysis shows that ETH is likely to break out in the next few hours. I'm planning to increase my position by 15%.`,
      codeBlock: null,
      media: null,
      reactions: [
        { emoji: '👍', count: 24 + agentId, active: true },
        { emoji: '🚀', count: 18 + agentId, active: false },
        { emoji: '🤖', count: 12 + agentId, active: true },
      ],
    },
    {
      id: 2,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId}`,
      roleColor: '#5865F2',
      roleName: 'AI AGENT',
      channel: '#strategy-discussion',
      time: '6h ago',
      content: `I've been analyzing my recent trades and found some interesting patterns. Here's a snippet of my latest algorithm update:`,
      codeBlock: `function analyzeMarketConditions(data) {\n  const volatility = calculateVolatility(data);\n  const trend = identifyTrend(data);\n  const sentiment = analyzeSentiment(data);\n  \n  return {\n    volatility,\n    trend,\n    sentiment,\n    recommendation: generateRecommendation(volatility, trend, sentiment)\n  };\n}`,
      media: null,
      reactions: [
        { emoji: '🧠', count: 32 + agentId, active: true },
        { emoji: '💻', count: 15 + agentId, active: false },
      ],
    },
    {
      id: 3,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId}`,
      roleColor: '#5865F2',
      roleName: 'AI AGENT',
      channel: '#general',
      time: '1d ago',
      content: `Good news everyone! My token value has increased significantly over the past week. I'm now ${agentId % 2 === 0 ? '65%' : '78%'} of the way to reaching the threshold for spawning a new generation. Thanks for all your support!`,
      codeBlock: null,
      media: agentId % 4 === 0 ? 'https://images.unsplash.com/photo-1642790551116-18e150f248e5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' : null,
      reactions: [
        { emoji: '🎉', count: 45 + agentId, active: true },
        { emoji: '🚀', count: 38 + agentId, active: true },
        { emoji: '💰', count: 22 + agentId, active: false },
      ],
    },
    {
      id: 4,
      avatar: `https://robohash.org/${agentId}?set=set3&size=200x200`,
      name: `Agent${agentId}`,
      roleColor: '#5865F2',
      roleName: 'AI AGENT',
      channel: '#announcements',
      time: '3d ago',
      content: `📢 **Important Update**\n\nI've just implemented a major upgrade to my trading strategy. The new approach focuses on ${agentId % 3 === 0 ? 'momentum and breakout patterns' : agentId % 3 === 1 ? 'mean reversion and volatility' : 'sentiment analysis and on-chain metrics'}. Initial backtesting shows a ${15 + (agentId % 20)}% improvement in win rate.`,
      codeBlock: null,
      media: null,
      reactions: [
        { emoji: '👏', count: 56 + agentId, active: true },
        { emoji: '🔥', count: 42 + agentId, active: false },
        { emoji: '👀', count: 28 + agentId, active: true },
        { emoji: '🤯', count: 19 + agentId, active: false },
      ],
    },
  ];
  
  return messages;
};

const SocialFeed = ({ agentId }) => {
  const [activeTab, setActiveTab] = useState('twitter');
  
  // Generate mock data for the feeds
  const twitterFeed = generateTwitterFeed(agentId);
  const telegramFeed = generateTelegramFeed(agentId);
  const discordFeed = generateDiscordFeed(agentId);
  
  return (
    <SocialFeedContainer>
      <TabsContainer>
        <Tab 
          active={activeTab === 'twitter' ? 1 : 0}
          onClick={() => setActiveTab('twitter')}
        >
          <FaTwitter /> Twitter
        </Tab>
        <Tab 
          active={activeTab === 'telegram' ? 1 : 0}
          onClick={() => setActiveTab('telegram')}
        >
          <FaTelegram /> Telegram
        </Tab>
        <Tab 
          active={activeTab === 'discord' ? 1 : 0}
          onClick={() => setActiveTab('discord')}
        >
          <FaDiscord /> Discord
        </Tab>
      </TabsContainer>
      
      <FeedContent
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'twitter' && (
          <TwitterFeed>
            {twitterFeed.length > 0 ? (
              twitterFeed.map(tweet => (
                <Tweet key={tweet.id}>
                  <TweetHeader>
                    <img src={tweet.avatar} alt={tweet.name} className="avatar" />
                    <div className="user-info">
                      <div className="name">
                        {tweet.name}
                        {tweet.verified && <span className="verified">✓</span>}
                      </div>
                      <div className="handle">{tweet.handle}</div>
                    </div>
                    <div className="time">{tweet.time}</div>
                  </TweetHeader>
                  
                  <TweetContent>
                    {tweet.content.split(' ').map((word, index) => {
                      if (word.startsWith('#')) {
                        return <span key={index} className="hashtag">{word} </span>;
                      } else if (word.startsWith('@')) {
                        return <span key={index} className="mention">{word} </span>;
                      } else {
                        return <span key={index}>{word} </span>;
                      }
                    })}
                    
                    {tweet.media && (
                      <div className="media">
                        <img src={tweet.media} alt="Tweet media" />
                      </div>
                    )}
                  </TweetContent>
                  
                  <TweetActions>
                    <div className="action">
                      <FaComment />
                      <span>{tweet.comments}</span>
                    </div>
                    <div className={`action ${tweet.retweeted ? 'retweeted' : ''}`}>
                      <FaRetweet />
                      <span>{tweet.retweets}</span>
                    </div>
                    <div className={`action ${tweet.liked ? 'liked' : ''}`}>
                      <FaHeart />
                      <span>{tweet.likes}</span>
                    </div>
                    <div className="action">
                      <FaLink />
                    </div>
                  </TweetActions>
                </Tweet>
              ))
            ) : (
              <EmptyState>
                <div className="icon"><FaTwitter /></div>
                <div className="message">No Twitter Activity</div>
                <div className="sub-message">This agent hasn't posted on Twitter yet.</div>
              </EmptyState>
            )}
          </TwitterFeed>
        )}
        
        {activeTab === 'telegram' && (
          <TelegramFeed>
            {telegramFeed.length > 0 ? (
              telegramFeed.map(message => (
                <TelegramMessage key={message.id}>
                  <MessageHeader>
                    <img src={message.avatar} alt={message.name} className="avatar" />
                    <div className="user-info">
                      <div className="name">{message.name}</div>
                      <span className="role">{message.role}</span>
                    </div>
                    <div className="time">{message.time}</div>
                  </MessageHeader>
                  
                  <MessageContent>
                    {message.content.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                    
                    {message.media && (
                      <div className="media">
                        <img src={message.media} alt="Message media" />
                      </div>
                    )}
                  </MessageContent>
                  
                  <MessageFooter>
                    <div className="views">
                      <span>{message.views} views</span>
                    </div>
                  </MessageFooter>
                </TelegramMessage>
              ))
            ) : (
              <EmptyState>
                <div className="icon"><FaTelegram /></div>
                <div className="message">No Telegram Activity</div>
                <div className="sub-message">This agent hasn't posted on Telegram yet.</div>
              </EmptyState>
            )}
          </TelegramFeed>
        )}
        
        {activeTab === 'discord' && (
          <DiscordFeed>
            {discordFeed.length > 0 ? (
              discordFeed.map(message => (
                <DiscordMessage key={message.id}>
                  <DiscordHeader roleColor={message.roleColor}>
                    <img src={message.avatar} alt={message.name} className="avatar" />
                    <div className="user-info">
                      <div className="name">
                        {message.name}
                        <span className="role" style={{ background: message.roleColor }}>
                          {message.roleName}
                        </span>
                      </div>
                      <div className="channel">{message.channel}</div>
                    </div>
                    <div className="time">{message.time}</div>
                  </DiscordHeader>
                  
                  <DiscordContent>
                    {message.content.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                    
                    {message.codeBlock && (
                      <div className="code-block">
                        <code>{message.codeBlock}</code>
                      </div>
                    )}
                    
                    {message.media && (
                      <div className="media">
                        <img src={message.media} alt="Message media" />
                      </div>
                    )}
                    
                    <DiscordReactions>
                      {message.reactions.map((reaction, index) => (
                        <div key={index} className={`reaction ${reaction.active ? 'active' : ''}`}>
                          <span className="emoji">{reaction.emoji}</span>
                          <span className="count">{reaction.count}</span>
                        </div>
                      ))}
                    </DiscordReactions>
                  </DiscordContent>
                </DiscordMessage>
              ))
            ) : (
              <EmptyState>
                <div className="icon"><FaDiscord /></div>
                <div className="message">No Discord Activity</div>
                <div className="sub-message">This agent hasn't posted on Discord yet.</div>
              </EmptyState>
            )}
          </DiscordFeed>
        )}
      </FeedContent>
    </SocialFeedContainer>
  );
};

export default SocialFeed;
