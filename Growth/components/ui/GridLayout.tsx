import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { Spacing } from '../../constants/Theme';

const { width: screenWidth } = Dimensions.get('window');

export interface GridLayoutProps {
  children: React.ReactNode[];
  columns?: 1 | 2 | 3;
  gap?: number;
  style?: ViewStyle;
  itemStyle?: ViewStyle;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  columns = 2,
  gap = Spacing.gridGap,
  style,
  itemStyle,
}) => {
  const getItemWidth = () => {
    const totalGap = gap * (columns - 1);
    const availableWidth = screenWidth - (Spacing.pagePadding * 2) - totalGap;
    return availableWidth / columns;
  };

  const renderRows = () => {
    const rows = [];
    const itemWidth = getItemWidth();
    
    for (let i = 0; i < children.length; i += columns) {
      const rowItems = children.slice(i, i + columns);
      
      rows.push(
        <View key={i} style={[styles.row, { gap }]}>
          {rowItems.map((child, index) => (
            <View
              key={index}
              style={[
                styles.item,
                {
                  width: itemWidth,
                  marginRight: index < rowItems.length - 1 ? gap : 0,
                },
                itemStyle,
              ]}
            >
              {child}
            </View>
          ))}
          {/* 填充空白项以保持对齐 */}
          {rowItems.length < columns &&
            Array.from({ length: columns - rowItems.length }).map((_, index) => (
              <View
                key={`empty-${index}`}
                style={[
                  styles.item,
                  {
                    width: itemWidth,
                    marginRight: index < columns - rowItems.length - 1 ? gap : 0,
                  },
                ]}
              />
            ))}
        </View>
      );
    }
    
    return rows;
  };

  return (
    <View style={[styles.container, style]}>
      {renderRows()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.gridGap,
  },
  item: {
    flex: 0,
  },
});

export default GridLayout;